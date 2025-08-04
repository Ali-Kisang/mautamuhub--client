import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Isiolo = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchIsioloData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Isiolo (_id === "Isiolo")
        const isioloVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Isiolo")?.users ||
          [];
        const isioloRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Isiolo")
            ?.users || [];

        setVipAccounts(isioloVIPAccounts);
        setRegularAccounts(isioloRegularAccounts);

        showToast("Isiolo escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Isiolo data", error);
        showToast(
          "Failed to load Isiolo escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchIsioloData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Isiolo Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Isiolo", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Isiolo", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Isiolo;
