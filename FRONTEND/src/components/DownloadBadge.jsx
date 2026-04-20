import React from "react";

const DownloadBadge = ({ dentisteId }) => {
  const downloadBadge = () => {
    fetch(`/api/dentistes/${dentisteId}/badge`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `badge-${dentisteId}.pdf`;
        a.click();
      });
  };

  return (
    <button
      onClick={downloadBadge}
      style={{
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        borderRadius: "6px",
      }}
    >
      Télécharger le badge PDF
    </button>
  );
};

export default DownloadBadge;
