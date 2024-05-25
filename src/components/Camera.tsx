import Webcam from "react-webcam";

export const Camera = () => {
  const videoConstraints: MediaTrackConstraints = {
    facingMode: { exact: "environment" },
    aspectRatio: 0.8,
  };

  return (
    <Webcam
      className="rounded-lg w-full my-3"
      videoConstraints={videoConstraints}
    />
  );
};
