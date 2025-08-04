import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Samburu = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchSamburuData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Samburu (_id === "Samburu")
        const SamburuVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Samburu")
            ?.users || [];
        const SamburuRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Samburu")
            ?.users || [];

        setVipAccounts(SamburuVIPAccounts);
        setRegularAccounts(SamburuRegularAccounts);

        showToast("Samburu escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Samburu data", error);
        showToast(
          "Failed to load Samburu escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchSamburuData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Samburu Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Samburu", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Samburu", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Samburu;
