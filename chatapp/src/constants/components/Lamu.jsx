import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";


const Lamu = () => {
  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchLamuData = async () => {
      try {
        const response = await api.get("/counties/grouped");
        console.log(response.data);

        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Lamu (_id === "Lamu")
        const lamuVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Lamu")
            ?.users || [];
        const lamuRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Lamu")
            ?.users || [];

        setVipAccounts(lamuVIPAccounts);
        setRegularAccounts(lamuRegularAccounts);
      } catch (error) {
        console.error("Error fetching Lamu data", error);
      }
    };

    fetchLamuData();
  }, []);

  return (
    <HomeLayout>
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Lamu Escorts
      </h1>

      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Lamu", users: vipAccounts }]}
      />

      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Lamu", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Lamu;
