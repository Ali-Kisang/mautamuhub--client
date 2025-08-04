import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Bomet = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchBometData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Bomet (_id === "Bomet")
        const bometVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Bomet")?.users ||
          [];
        const bometRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Bomet")
            ?.users || [];

        setVipAccounts(bometVIPAccounts);
        setRegularAccounts(bometRegularAccounts);

        showToast("Bomet escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Bomet data", error);
        showToast(
          "Failed to load Bomet escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchBometData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Bomet Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Bomet", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Bomet", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Bomet;
