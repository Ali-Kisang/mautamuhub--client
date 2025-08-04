import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Kajiado = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchKajiadoData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Kajiado (_id === "Kajiado")
        const KajiadoVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Kajiado")
            ?.users || [];
        const KajiadoRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Kajiado")
            ?.users || [];

        setVipAccounts(KajiadoVIPAccounts);
        setRegularAccounts(KajiadoRegularAccounts);

        showToast("Kajiado escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Kajiado data", error);
        showToast(
          "Failed to load Kajiado escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchKajiadoData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kajiado Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Kajiado", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Kajiado", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Kajiado;
