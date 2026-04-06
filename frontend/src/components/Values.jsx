const values = [
  {
    title: "Udržitelné materiály",
    text: "Bio bavlna, len a recyklované tkaniny."
  },
  {
    title: "Etická výroba",
    text: "Férové podmínky a zodpovědný přístup."
  },
  {
    title: "Nízká uhlíková stopa",
    text: "Menší dopad na planetu."
  }
];

export default function Values() {
  return (
    <section className="values">
      <div className="container values-grid">
        {values.map((item, index) => (
          <div className="value-card" key={index}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}