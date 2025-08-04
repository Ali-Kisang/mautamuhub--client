import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Wajir = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchWajirData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Wajir (_id === "Wajir")
        const wajirVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Wajir")?.users ||
          [];
        const wajirRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Wajir")
            ?.users || [];

        setVipAccounts(wajirVIPAccounts);
        setRegularAccounts(wajirRegularAccounts);

        showToast("Wajir escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Wajir data", error);
        showToast(
          "Failed to load Wajir escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchWajirData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Wajir Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Wajir", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Wajir", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Wajir;
