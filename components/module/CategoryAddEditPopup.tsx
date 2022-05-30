import {Grid, TextField} from '@mui/material';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CreateCategory from "./CreateCategory";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://devapiv2.walcart.com/graphql",
  cache: new InMemoryCache(),
});

const initialValues = {
  uid: '',
  name: ''
};

const CategoryAddEditPopup: FC<any> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const isEdit = itemId != null;

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
  });

  const [mutatedData, setMutatedData] = useState<any>(null);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<any>([]);

  const createFunction = useCallback(() => {
    setMutatedData([]);
    setIsCreate(false);
    setSubmittedData([]);

  }, [isCreate]);

  useEffect(() => {
    if (isCreate) {
      createFunction();
    }
  }, [isCreate]);



  const onSubmit: SubmitHandler<any> = async (param: any) => {
    setSubmittedData(param);
    setIsCreate((prevState => !prevState));

    console.log(isCreate);

  /*  const results = await fetch("/createCategoryApi", {
      method: "post",
      body: data.category + "?" + data.parent,
    });*/


    try {
      const { data } = await client.mutate({
        mutation: gql` {
createCategory(
category: {
name:"${param.category}"
${param.parent ? "parentCategoryUid:"+ param.parent : ''}
}
)
}

   `,
      });
      // res.status(200).json({ characters: data.characters.results, error: null });
    } catch (error) {
      if (error.message === "404: Not Found") {
        // res.status(404).json({ characters: null, error: "No Characters found" });
      } else {
        /*res
            .status(500)
            .json({ characters: null, error: "Internal Error, Please try again" });*/
      }
    }


    // const { characters, error } = await results.json();

    try {
      if (itemId) {
        console.log(itemId);
      } else {
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
    }
  };

  return (
      <div>
        <Dialog
            open={true}
            onClose={props.closeAddEditModal}
        >
          {/*<AppBar sx={{ position: 'relative' }}>*/}
          {/*  <Toolbar>*/}
          {/*    <IconButton*/}
          {/*        edge="start"*/}
          {/*        color="inherit"*/}
          {/*        onClick={props.closeAddEditModal}*/}
          {/*        aria-label="close"*/}
          {/*    >*/}
          {/*    </IconButton>*/}
          {/*    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">*/}
          {/*      close*/}
          {/*    </Typography>*/}
          {/*    <Button autoFocus color="inherit" type={"submit"}>*/}
          {/*      save*/}
          {/*    </Button>*/}
          {/*  </Toolbar>*/}
          {/*</AppBar>*/}

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
                <Button onClick={props.closeAddEditModal}>cancel</Button>
              </Grid>
            </Grid>
          </form>

        </Dialog>
      </div>
  );
}


export default CategoryAddEditPopup;
