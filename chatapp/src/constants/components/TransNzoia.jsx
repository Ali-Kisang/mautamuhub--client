import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const TransNzoia = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchTransNzoiaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Trans Nzoia (_id === "Trans Nzoia")
        const transNzoiaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Trans Nzoia")
            ?.users || [];
        const transNzoiaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Trans Nzoia")
            ?.users || [];

        setVipAccounts(transNzoiaVIPAccounts);
        setRegularAccounts(transNzoiaRegularAccounts);

        showToast("Trans Nzoia escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Trans Nzoia data", error);
        showToast(
          "Failed to load Trans Nzoia escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchTransNzoiaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Trans Nzoia Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Trans Nzoia", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[
          { _id: "Trans Nzoia", users: regularAccounts },
        ]}
      />
    </HomeLayout>
  );
};

export default TransNzoia;
