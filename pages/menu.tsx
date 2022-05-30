import {gql, useQuery} from "@apollo/client";
import {Grid} from "@mui/material";
import {useCallback, useEffect, useState} from "react";

const getAllCategories = gql`
  {
getCategories(
pagination: {
limit: 100
skip: 0
}
){
message
statusCode
result {
count
categories {
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
function Menu() {
    const { data, loading, error, fetchMore } = useQuery(getAllCategories, {
        variables: { first: 3 },
    });

    const rows = data?.getCategories?.result?.categories.map((item) => (
        {...item, id: item.uid}
    ));
    const [categories, setCategories] = useState<any>([]);
    const [subCategories, setSubCategories] = useState<any>([]);
    const [subSubCategories, setSubSubCategories] = useState<any>([]);
    const [focusedCategory, setFocusedCategory] = useState<any>(0);
    const [focusedSubCategory, setFocusedSubCategory] = useState<any>(0);

    useEffect(() => {
        if (data) {
            const categories = rows.filter((item) => {
                return item.parent.uid == "root";
            })
            setCategories(categories);
            console.log(categories);
        }
    }, [data]);

    const handleCategoryFocus = useCallback((e) => {
        setFocusedCategory(e.target.id);
    }, []);

    useEffect(() => {
        if (focusedCategory) {
            const subCategories = rows.filter((item) => {
                return item.parent.uid == focusedCategory;
            })

            setSubCategories(subCategories);
        }
    }, [focusedCategory]);

    const handleCategoryUnfocus = useCallback((e) => {
        setFocusedCategory(null);
    }, []);

    const handleSubCategoryUnfocus = useCallback((e) => {
        setFocusedSubCategory(null);
    }, []);

    useEffect(() => {
        if (focusedCategory && focusedSubCategory) {
            const subSubCategories = rows.filter((item) => {
                return rows.parent.uid  == item.id && (
                    rows.parents.filter((parent) => {
                        return parent.uid == focusedSubCategory;
                    })
                )
            })

            setSubSubCategories(subSubCategories);
            console.log("sub sub", subSubCategories);
        }
    }, [focusedCategory, focusedSubCategory]);

    return (
        <div>
            <h1>Mega Menu</h1>
            <Grid container mt={5} justifyContent={'center'}>
                <Grid item xs={4}>
                    <ul className={"list"}>
                        {categories.map((category) => {
                           return  <li key={category.uid} id={category.uid} onMouseEnter={handleCategoryFocus} onMouseLeave={handleCategoryUnfocus}>{category.name}</li>
                        })}
                    </ul>
                </Grid>

                <Grid item xs={4}>
                    <ul className={"list"}>
                        {subCategories.map((subCategory) => {
                            return  <li key={subCategory.uid} id={subCategory.uid} onMouseEnter={handleCategoryFocus} onMouseLeave={handleCategoryUnfocus}>{subCategory.name}</li>
                        })}
                    </ul>
                </Grid>
                <Grid item xs={4}>
                    <ul className={"list"}>
                        {subSubCategories.map((sbsb) => {
                            return  <li key={sbsb.uid} id={sbsb.uid}>{sbsb.name}</li>
                        })}
                    </ul>
                </Grid>
            </Grid>
        </div>
    )

}

export default Menu;