import { useEffect, useState } from "react";
import axios from "axios";

import SpasList from "./SpasList";
import VVIPList from "./VVIPList";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import HomeLayout from "./HomeLayout";
import Header from "./Header";
const Hero = () => {
  const server = "http://localhost:5000/api";
  const [users, setUsers] = useState({
    spas: [],
    vvipAccounts: [],
    vipAccountsByCounty: [],
    regularAccountsByCounty: [],
  });
  const [selectedCounty, setSelectedCounty] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${server}/counties/grouped`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  // Filter users by selected county
  const filteredSpas = selectedCounty ? [] : users.spas;
  const filteredVVIPAccounts = selectedCounty ? [] : users.vvipAccounts;
  const filteredVIPAccountsByCounty = users.vipAccountsByCounty.filter(
    (account) => account.county === selectedCounty
  );
  const filteredRegularAccountsByCounty = users.regularAccountsByCounty.filter(
    (account) => account.county === selectedCounty
  );

  return (
    <>
      <Header />
      <HomeLayout onCountySelect={setSelectedCounty}>
        {selectedCounty ? (
          <div>
            {/* Display VIP and Regular accounts for selected county */}
            {filteredVIPAccountsByCounty.length > 0 ? (
              <VIPListByCounty
                vipAccountsByCounty={filteredVIPAccountsByCounty}
              />
            ) : (
              <p className="text-gray-500">
                No VIP accounts available for this county.
              </p>
            )}
            {filteredRegularAccountsByCounty.length > 0 ? (
              <RegularListByCounty
                regularAccountsByCounty={filteredRegularAccountsByCounty}
              />
            ) : (
              <p className="text-gray-500">
                No regular accounts available for this county.
              </p>
            )}
          </div>
        ) : (
          <div>
            {/* Always display Spas and VVIP accounts */}
            <SpasList spas={filteredSpas} />
            <VVIPList vvipAccounts={filteredVVIPAccounts} />
          </div>
        )}
      </HomeLayout>
    </>
  );
};

export default Hero;
