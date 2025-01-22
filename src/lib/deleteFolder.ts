import { deleteObject, listAll, ref } from "firebase/storage";
import { storage } from "./firebase";


//? For delete folder path all files in firebase storage 
const deleteFolder = async (folderPath: string) => {
  const folderRef = ref(storage, folderPath);

  try {
    const result = await listAll(folderRef);

    const deletePromises = result.items.map((fileRef) => deleteObject(fileRef));
    await Promise.all(deletePromises);

    const folderPromises = result.prefixes.map((subFolderRef) =>
      deleteFolder(subFolderRef.fullPath)
    );
    await Promise.all(folderPromises);
  } catch (error) {
    throw error;
  }
};

export default deleteFolder;
