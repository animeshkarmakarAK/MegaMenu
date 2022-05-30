import {gql, useQuery} from "@apollo/client";
import React, {FC, useCallback, useEffect, useState} from 'react';

const CreateCategory: FC<any> = (...data) => {
    const createQ = gql`
  {
  mutation {
createCategory(
category: {
name:"TEST-01"
}
)
{
message
statusCode
result {
uid
name
parent {
uid
name
}
parents {
uid
name
}
isActive
inActiveNote
createdAt
updatedAt
}
}
}
}
`;
    const { data: insertData, loading: isLoadingCreate, error: isErrorCreate } = useQuery(createQ);
    console.log(insertData);

    return (
        <div></div>
    );
}

export  default  CreateCategory;