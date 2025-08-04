import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";


const Kilifi = () => {
  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchKilifiData = async () => {
      try {
        const response = await api.get("/counties/grouped");
        console.log(response.data);

        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Kilifi (_id === "Kilifi")
        const kilifiVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Kilifi")
            ?.users || [];
        const kilifiRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Kilifi")
            ?.users || [];

        setVipAccounts(kilifiVIPAccounts);
        setRegularAccounts(kilifiRegularAccounts);
      } catch (error) {
        console.error("Error fetching Kilifi data", error);
      }
    };

    fetchKilifiData();
  }, []);

  return (
    <HomeLayout>
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kilifi Escorts
      </h1>

      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Kilifi", users: vipAccounts }]}
      />

      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Kilifi", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Kilifi;
