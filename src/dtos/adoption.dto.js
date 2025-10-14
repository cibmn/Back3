export const createAdoptionDTO = ({ uid, pid }) => {
  if (!uid || !pid) throw new Error("User ID and Pet ID are required");
  return { uid, pid };
};
