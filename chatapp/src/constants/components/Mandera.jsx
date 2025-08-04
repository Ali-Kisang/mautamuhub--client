import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Mandera = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchManderaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Mandera (_id === "Mandera")
        const manderaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Mandera")?.users ||
          [];
        const manderaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Mandera")
            ?.users || [];

        setVipAccounts(manderaVIPAccounts);
        setRegularAccounts(manderaRegularAccounts);

        showToast("Mandera escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Mandera data", error);
        showToast(
          "Failed to load Mandera escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchManderaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Mandera Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Mandera", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Mandera", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Mandera;
