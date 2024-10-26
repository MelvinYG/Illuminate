import apiRequest from "./apiRequest";

// export const singlePageLoader = async ({request, params}) => {
//     const res = await apiRequest("/listing/"+params.id);
//     return res.data;
// };

// export const listPageLoader = async ({request, params}) => {
//     const query = request.url.split("?")[1];  // using regex for extarting second term of the 2 arrays got as a result of split

//     const res = await apiRequest("/listing?"+query);
//     return res.data;
// };

export const profilePageLoader = async () => {
    const res = await apiRequest("/user/", {
        withCredentials: true 
    });
    return res.data;
};

export const devicePageLoader = async () => {
    const res = await apiRequest.get("/device/", {
        withCredentials: true  
    });
    return res.data;
}