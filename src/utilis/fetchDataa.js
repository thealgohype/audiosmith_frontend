import axios from 'axios';

export const createFetchData = (localData, selectedItem, setAires) => {
  return async () => {
    try {
      const postData = {
        userEmail: localData.hd || ""
      };
      const response = await axios.post(`${process.env.REACT_APP_CHATPRO_BACKEND_GET}/api/get/`, postData);
      
      const obj = response.data.grouped_data;
      for (let k in obj) {
        if (selectedItem === k) {
          setAires(obj[k]);
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
};