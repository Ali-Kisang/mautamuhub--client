
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";

const countyMenu = [
  { name: "Mombasa", path: "/mombasa-escorts", countyCode: 1 },
  { name: "Kwale", path: "/kwale-escorts", countyCode: 2 },
  { name: "Kilifi", path: "/kilifi-escorts", countyCode: 3 },
  { name: "Tana River", path: "/tana-river-escorts", countyCode: 4 },
  { name: "Lamu", path: "/lamu-escorts", countyCode: 5 },
  { name: "Taita Taveta", path: "/taita-taveta-escorts", countyCode: 6 },
  { name: "Garissa", path: "/garissa-escorts", countyCode: 7 },
  { name: "Wajir", path: "/wajir-escorts", countyCode: 8 },
 { name: "Mandera", path: "/mandera-escorts", countyCode: 9 },
  { name: "Marsabit", path: "/marsabit-escorts", countyCode: 10 },
  { name: "Isiolo", path: "/isiolo-escorts", countyCode: 11 },
  { name: "Meru", path: "/meru-escorts", countyCode: 12 },
  { name: "Tharaka Nithi", path: "/tharaka-nithi-escorts", countyCode: 13 },
  { name: "Embu", path: "/embu-escorts", countyCode: 14 },
  { name: "Kitui", path: "/kitui-escorts", countyCode: 15 },
  { name: "Machakos", path: "/machakos-escorts", countyCode: 16 },
  { name: "Makueni", path: "/makueni-escorts", countyCode: 17 },
  { name: "Nyandarua", path: "/nyandarua-escorts", countyCode: 18 },
  { name: "Nyeri", path: "/nyeri-escorts", countyCode: 19 },
  { name: "Kirinyaga", path: "/kirinyaga-escorts", countyCode: 20 },
  { name: "Murang'A", path: "/muranga-escorts", countyCode: 21 },
  { name: "Kiambu", path: "/kiambu-escorts", countyCode: 22 },
  { name: "Turkana", path: "/turkana-escorts", countyCode: 23 },
  { name: "West Pokot", path: "/west-pokot-escorts", countyCode: 24 },
  { name: "Samburu", path: "/samburu-escorts", countyCode: 25 },
  { name: "Trans Nzoia", path: "/trans-nzoia-escorts", countyCode: 26 },
  { name: "Uasin Gishu", path: "/uasin-gishu-escorts", countyCode: 27 },
  { name: "Elgeyo Marakwet", path: "/elgeyo-marakwet-escorts", countyCode: 28 },
  { name: "Nandi", path: "/nandi-escorts", countyCode: 29 },
  { name: "Baringo", path: "/baringo-escorts", countyCode: 30 },
  { name: "Laikipia", path: "/laikipia-escorts", countyCode: 31 },
  { name: "Nakuru", path: "/nakuru-escorts", countyCode: 32 },
  { name: "Narok", path: "/narok-escorts", countyCode: 33 },
  { name: "Kajiado", path: "/kajiado-escorts", countyCode: 34 },
  { name: "Kericho", path: "/kericho-escorts", countyCode: 35 },
  { name: "Bomet", path: "/bomet-escorts", countyCode: 36 },
  { name: "Kakamega", path: "/kakamega-escorts", countyCode: 37 },
  { name: "Vihiga", path: "/vihiga-escorts", countyCode: 38 },
  { name: "Bungoma", path: "/bungoma-escorts", countyCode: 39 },
  { name: "Busia", path: "/busia-escorts", countyCode: 40 },
  { name: "Siaya", path: "/siaya-escorts", countyCode: 41 },
  { name: "Kisumu", path: "/kisumu-escorts", countyCode: 42 },
  { name: "Homa Bay", path: "/homa-bay-escorts", countyCode: 43 },
  { name: "Migori", path: "/migori-escorts", countyCode: 44 },
  { name: "Kisii", path: "/kisii-escorts", countyCode: 45 },
  { name: "Nyamira", path: "/nyamira-escorts", countyCode: 46 },
  { name: "Nairobi", path: "/nairobi-escorts", countyCode: 47 },
  // Add all other counties...
];

const HomeLayout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <div className="container mx-auto p-4 space-y-4 bg-gradient-to-br from-coralPink via-rose-100 to-pink ">
        {/* Locations (top horizontal scroll) */}
        <div className="w-full overflow-x-auto  bg-gradient-to-br from-coralPink via-rose-100 to-pink">
          <div className="flex gap-2 pb-2 min-w-max">
            {countyMenu.map((county) => {
              const isActive = location.pathname === county.path;
              return (
                <Link
                  key={county.countyCode}
                  to={county.path}
                  className={`btn btn-sm whitespace-nowrap ${
                    isActive ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {county.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-4 rounded-box shadow"
        >
          {children}
        </motion.main>
      </div>

      <Footer />
    </>
  );
};

export default HomeLayout;
