import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Laikipia = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchLaikipiaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Laikipia (_id === "Laikipia")
        const laikipiaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Laikipia")
            ?.users || [];
        const laikipiaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Laikipia")
            ?.users || [];

        setVipAccounts(laikipiaVIPAccounts);
        setRegularAccounts(laikipiaRegularAccounts);

        showToast("Laikipia escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Laikipia data", error);
        showToast(
          "Failed to load Laikipia escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchLaikipiaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Laikipia Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Laikipia", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Laikipia", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Laikipia;
