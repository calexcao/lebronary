{
  /*Mock/Temporary Data*/
}
const locations = [
  {
    id: 1,
    name: "Markham Public Library - Aaniin Branch",
    address: "5665 14th Ave, Markham, ON L3S 3K5",
    hours: "10:00 a.m. - 9:00 p.m.",
    contact: "(905) 513-7977",
  },
  {
    id: 2,
    name: "Toronto Public Library - Goldhawk Park Branch",
    address: "295 Alton Towers Cir, Toronto, ON M1V 4E7",
    hours: "09:00 a.m. - 9:00 p.m.",
    contact: "(416) 396-8964",
  },
  {
    id: 3,
    name: "Markham Public Library - Milliken Mills Branch",
    address: "7600 Kennedy Rd #1, Markham, ON L3R 9S5",
    hours: "10:00 a.m. - 9:00 p.m.",
    contact: "(905) 513-7977",
  },
  {
    id: 4,
    name: "Aaniin Community Centre",
    address: "5665 14th Ave, Markham, ON L3S 3K5",
    hours: "10:00 a.m. - 9:00 p.m.",
    contact: "(905) 475-4851",
  },
];

function Locations() {
  return (
    <div className="container mx-auto flex-col p-4 pt-10 space-y-8">
      <h1 className="text-3xl font-bold">Locations</h1>
      {locations.map((location) => (
        <div key={location.id}>
          <div className="flex flex-col w-full border rounded-md p-4 space-y-2">
            <div>
              <p className="text-lg font-bold">{location.name}</p>
              <p className="text-muted-foreground">{location.address}</p>
            </div>
            <p>Hours: {location.hours}</p>
            <p>Contact: {location.contact}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Locations;
