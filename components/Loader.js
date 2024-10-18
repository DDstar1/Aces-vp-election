import styles from "./Loader.module.css"; // Import the CSS module

const Loading = () => {
  return (
    <div
      className={`flex items-center justify-center h-screen ${styles.loader}`}
    >
      <div className={styles.spinner_border} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
