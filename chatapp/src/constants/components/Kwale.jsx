import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Kwale = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchKwaleData = async () => {
      dispatch(showLoading());
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Kwale (_id === "Kwale")
        const kwaleVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Kwale")?.users ||
          [];
        const kwaleRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Kwale")
            ?.users || [];

        setVipAccounts(kwaleVIPAccounts);
        setRegularAccounts(kwaleRegularAccounts);

        showToast("Kwale escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Kwale data", error);
        showToast(
          "Failed to load Kwale escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchKwaleData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kwale Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Kwale", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Kwale", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Kwale;
