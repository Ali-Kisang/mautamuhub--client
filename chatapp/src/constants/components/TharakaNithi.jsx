import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const TharakaNithi = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchTharakaNithiData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for TharakaNithi (_id === "TharakaNithi")
        const tharakaNithiVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Tharaka Nithi")?.users ||
          [];
        const tharakaNithiRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Tharaka Nithi")
            ?.users || [];

        setVipAccounts(tharakaNithiVIPAccounts);
        setRegularAccounts(tharakaNithiRegularAccounts);

        showToast("TharakaNithi escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching TharakaNithi data", error);
        showToast(
          "Failed to load TharakaNithi escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchTharakaNithiData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to TharakaNithi Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Tharaka Nithi", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Tharaka Nithi", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default TharakaNithi;
