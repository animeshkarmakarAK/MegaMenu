import {gql, useQuery} from '@apollo/client';
import Link from 'next/link';
import {GridColDef} from '@mui/x-data-grid';
import {Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useCallback, useState} from "react";
import CategoryAddEditPopup from "../components/module/CategoryAddEditPopup";

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

const columns: GridColDef[] = [
    { field: 'uid', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'action', headerName: 'Action', width: 130 },
    ];

function Home() {
  const { user } = {user: true};

  const { data, loading, error, fetchMore } = useQuery(getAllCategories, {
    variables: { first: 3 },
  });

   const rows = data?.getCategories?.result?.categories.map((item) => (
        {...item, id: item.uid}
    ));

    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>({});
    const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);

    const openAddEditModal = useCallback((itemId: number | null = null) => {
        setIsOpenAddEditModal(true);
        setSelectedItemId(itemId);

        const selectedItem = rows.filter((item) => item.uid == itemId);
        if (selectedItem.length > 0) {
            setSelectedItem(selectedItem[0]);
        }
    }, []);

    const closeAddEditModal = useCallback(() => {
        setIsOpenAddEditModal(false);
        setSelectedItemId(null);
    }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center">
        To view the awesome links you need to{' '}
        <Link href="/api/auth/login">
          <a className=" block bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
            Login
          </a>
        </Link>
      </div>
    );
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div>
        <Grid container>
            <Grid item xs={6} alignContent={"center"}>Category Table</Grid>
            <Grid item xs={6}>
                <Button onClick={() => openAddEditModal()}>Add</Button>
            </Grid>

            <Grid item xs={8} alignItems={"center"}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">{row.uid}</TableCell>
                                    <TableCell align="right">{row.name}</TableCell>
                                    <TableCell align="right">
                                        <Grid container spacing={2} sx={{left: '10px'}}>
                                            <Grid item xs={2}>
                                                <a href={'#'} color={'green'} onClick={() => openAddEditModal(row.uid)}>Edit</a>
                                            </Grid>

                                            <Grid item xs={2}>
                                                <a color={'red'} href={'#'}>Delete</a>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>

        {isOpenAddEditModal && (
            <CategoryAddEditPopup
                key={1}
                onClose={closeAddEditModal}
                itemId={selectedItemId}
                item={selectedItem}
            />
        )}
    </div>
  );

}

export default Home;
