import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Vihiga = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchVihigaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Vihiga (_id === "Vihiga")
        const vihigaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Vihiga")
            ?.users || [];
        const vihigaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Vihiga")
            ?.users || [];

        setVipAccounts(vihigaVIPAccounts);
        setRegularAccounts(vihigaRegularAccounts);

        showToast("Vihiga escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Vihiga data", error);
        showToast(
          "Failed to load Vihiga escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchVihigaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Vihiga Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Vihiga", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Vihiga", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Vihiga;
