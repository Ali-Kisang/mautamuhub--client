import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Muranga = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchMurangaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Muranga (_id === "Muranga")
        const murangaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Murang'A")
            ?.users || [];
        const murangaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Murang'A")
            ?.users || [];

        setVipAccounts(murangaVIPAccounts);
        setRegularAccounts(murangaRegularAccounts);

        showToast("Muranga escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Muranga data", error);
        showToast(
          "Failed to load Muranga escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchMurangaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Muranga Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Murang'A", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Murang'A", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Muranga;
