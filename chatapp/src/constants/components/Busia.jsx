import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Busia = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchBusiaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Busia (_id === "Busia")
        const busiaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Busia")?.users ||
          [];
        const busiaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Busia")
            ?.users || [];

        setVipAccounts(busiaVIPAccounts);
        setRegularAccounts(busiaRegularAccounts);

        showToast("Busia escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Busia data", error);
        showToast(
          "Failed to load Busia escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchBusiaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Busia Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Busia", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Busia", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Busia;
