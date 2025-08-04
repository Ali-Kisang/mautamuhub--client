import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Siaya = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchSiayaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Siaya (_id === "Siaya")
        const siayaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Siaya")?.users ||
          [];
        const siayaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Siaya")
            ?.users || [];

        setVipAccounts(siayaVIPAccounts);
        setRegularAccounts(siayaRegularAccounts);

        showToast("Siaya escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Siaya data", error);
        showToast(
          "Failed to load Siaya escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchSiayaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Siaya Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Siaya", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Siaya", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Siaya;
