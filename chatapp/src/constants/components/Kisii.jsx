import { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Kisii = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchKisiiData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Kisii (_id === "Kisii")
        const kisiiVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Kisii")?.users ||
          [];
        const kisiiRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Kisii")
            ?.users || [];

        setVipAccounts(kisiiVIPAccounts);
        setRegularAccounts(kisiiRegularAccounts);

        showToast("Kisii escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Kisii data", error);
        showToast(
          "Failed to load Kisii escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchKisiiData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kisii Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Kisii", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Kisii", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Kisii;
