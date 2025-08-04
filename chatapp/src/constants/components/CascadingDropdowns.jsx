
import  { useState } from 'react'

const CascadingDropdowns = () => {
    const [selectedCounty, setSelectedCounty] = useState('');
    const [selectedConstituency, setSelectedConstituency] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

const counties = [
  {
    "countyCode": 1,
    "name": "Mombasa",
    "constituencies": [
      {
        "name": "Changamwe",
        "wards": ["Port Reitz", "Kipevu", "Airport", "Changamwe", "Chaani"]
      },
      { "name": "Jomvu", "wards": ["Jomvu Kuu", "Miritini", "Mikindani"] },
      {
        "name": "Kisauni",
        "wards": [
          "Mjambere",
          "Junda",
          "Bamburi",
          "Mwakirunge",
          "Mtopanga",
          "Magogoni",
          "Shanzu"
        ]
      },
      {
        "name": "Nyali",
        "wards": [
          "Frere Town",
          "Ziwa La Ng'Ombe",
          "Mkomani",
          "Kongowea",
          "Kadzandani"
        ]
      },
      {
        "name": "Likoni",
        "wards": ["Mtongwe", "Shika Adabu", "Bofu", "Likoni", "Timbwani"]
      },
      {
        "name": "Mvita",
        "wards": [
          "Mji Wa Kale/Makadara",
          "Tudor",
          "Tononoka",
          "Shimanzi/Ganjoni",
          "Majengo"
        ]
      }
    ]
  },
  {
    "countyCode": 2,
    "name": "Kwale",
    "constituencies": [
      {
        "name": "Msambweni",
        "wards": ["Gombatobongwe", "Ukunda", "Kinondo", "Ramisi"]
      },
      {
        "name": "Lungalunga",
        "wards": ["Pongwekikoneni", "Dzombo", "Mwereni", "Vanga"]
      },
      {
        "name": "Matuga",
        "wards": ["Tsimba Golini", "Waa", "Tiwi", "Kubo South", "Mkongani"]
      },
      {
        "name": "Kinango",
        "wards": [
          "Nadavaya",
          "Puma",
          "Kinango",
          "Mackinnon-Road",
          "Chengoni/Samburu",
          "Mwavumbo",
          "Kasemeni"
        ]
      }
    ]
  }
];
const handleCountyChange = (e) => {
    setSelectedCounty(e.target.value);
    setSelectedConstituency('');
    setSelectedWard('');
  };

  const handleConstituencyChange = (e) => {
    setSelectedConstituency(e.target.value);
    setSelectedWard('');
  };
  return (
    <div>
      <h2>Cascading Dropdowns</h2>
      <select value={selectedCounty} onChange={handleCountyChange}>
        <option value="">Select County</option>
        {counties.map(county => (
          <option key={county.name} value={county.name}>{county.name}</option>
        ))}
      </select>
      <select value={selectedConstituency} onChange={handleConstituencyChange}>
        <option value="">Select Constituency</option>
        {selectedCounty &&
          counties.find(c => c.name === selectedCounty).constituencies.map(constituency => (
            <option key={constituency.name} value={constituency.name}>{constituency.name}</option>
          ))
        }
      </select>
      <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
        <option value="">Select Ward</option>
        {selectedConstituency &&
          counties.find(c => c.name === selectedCounty).constituencies.find(c => c.name === selectedConstituency).wards.map(ward => (
            <option key={ward} value={ward}>{ward}</option>
          ))
        }
      </select>
    </div>
  );
}

export default CascadingDropdowns;
