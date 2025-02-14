import { callApi } from "@/utils/api";
import { endpoint } from "@/utils/endpoint";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useFetchUser = () => {
  const [roleCodes, setRoleCodes] = useState([]);
  const userQuery = useQuery({
    queryKey: ["users-query"],
    queryFn: async () => {
      const result = await callApi(endpoint.user_list, "GET", null, null, {
        role_codes: roleCodes,
      });
      return result;
    },
  });

  return { userQuery, roleCodes, setRoleCodes };
};

export default useFetchUser;
