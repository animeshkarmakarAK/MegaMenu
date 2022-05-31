import {AppBar, Grid, TextField} from '@mui/material';
import React, {FC, useEffect} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://devapiv2.walcart.com/graphql",
  cache: new InMemoryCache(),
});


const CategoryAddEditPopup: FC<any> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const isEdit = itemId != null;

  const {
    register,
    handleSubmit,
      reset,
    formState: {errors, isSubmitting},
  } = useForm<any>({
  });

  useEffect(() => {
    if (itemId) {
      reset({
        category: props.item.name
      })
    }
  }, []);


  const onSubmit: SubmitHandler<any> = async (param: any) => {
    if (itemId) {
      const {data} = await  client.mutate({
        mutation: gql `
        mutation {
updateCategory (
categoryUid: "${itemId}"
category: {
name: "${param.category}"
}
){
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
}`,
      });
    }else {
      try {
        const { data } = await client.mutate({
          mutation: gql`
          mutation {
createCategory(
category: {
name: "${param.category}"
parentCategoryUid: "${param.parent ? param.parent : ''}"
}
){
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
   `,
        });
      } catch (error) {
        if (error.message === "404: Not Found") {
          console.log('404');
        } else {
          console.log('500');
        }
      }finally {
        props.onClose();
      }
    }
  };

  return (
      <div>
        <Dialog
            open={true}
            onClose={props.onClose}
        >
          <AppBar sx={{ position: 'relative' }}>
            <title>Add Edit Category</title>
          </AppBar>

          <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
            <Grid container mt={2}>
              <Grid item xs={12}>
                <TextField {...register('category')} id="category" label="Category Name" variant="outlined" />
              </Grid>

              {
                !itemId && (
                      <Grid item xs={12}>
                        <TextField {...register('parent_id')} id="parent_id" label="Parent" variant="outlined" />
                      </Grid>
                  )
              }
              <Grid item xs={12}>
                <Button type={"submit"}>Save</Button>
                <Button onClick={props.onClose}>cancel</Button>
              </Grid>
            </Grid>
          </form>
        </Dialog>
      </div>
  );
}

export default CategoryAddEditPopup;
