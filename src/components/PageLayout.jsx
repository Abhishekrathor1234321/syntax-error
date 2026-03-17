const PageLayout = ({ title, subtitle, children }) => {
  return (
    <div style={{ padding: "40px", paddingTop: "90px", maxWidth: "1000px", margin: "auto" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>{title}</h1>
      <p style={{ color: "gray", marginBottom: "30px" }}>{subtitle}</p>
      {children}
    </div>
  );
};

export default PageLayout;