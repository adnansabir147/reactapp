import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  InputAdornment,
  TextField,
  Grid,
  Card,
  Typography,
  Paper,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to realtime updates for Products collection
    const unsub = onSnapshot(collection(db, "Products"), (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteDoc(doc(db, "Products", id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setPage(0); // reset to first page on search
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  // Filter products by name or category based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchQuery) ||
      product.category?.toLowerCase().includes(searchQuery)
  );

  // Paginate filtered products
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Define table columns with fixed widths
  const columns = [
    { key: "name", label: "Name", width: "180px" },
    { key: "description", label: "Description", width: "260px" },
    { key: "price", label: "Price", width: "120px" },
    { key: "discountPrice", label: "Discount", width: "120px" },
    { key: "stock", label: "Stock", width: "100px" },
    { key: "category", label: "Category", width: "160px" },
    { key: "tags", label: "Tags", width: "200px" },
    { key: "thumbnail", label: "Thumbnail", width: "120px" },
    { key: "images", label: "Images", width: "160px" },
    { key: "actions", label: "Actions", width: "120px" },
  ];

  const cellStyle = (width) => ({
    width,
    minWidth: width,
    maxWidth: width,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
                mb={3}
              >
                <Typography variant="h5">Product List</Typography>

                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Search by name or category"
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: { xs: "100%", sm: "300px" } }}
                />

                <MDButton color="info" onClick={() => navigate("/products/add")}>
                  Add Product
                </MDButton>
              </MDBox>

              <TableContainer
                component={Paper}
                sx={{ maxHeight: "70vh", overflow: "auto" }}
              >
                <Table stickyHeader sx={{ tableLayout: "fixed", minWidth: 1500 }}>
                  <TableHead>
                    <TableRow>
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
                          sx={{ ...cellStyle(col.width), fontWeight: "bold" }}
                        >
                          {col.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedProducts.length > 0 ? (
                      paginatedProducts.map((product) => (
                        <TableRow key={product.id}>
                          {columns.map((col) => (
                            <TableCell key={col.key} sx={cellStyle(col.width)}>
                              {col.key === "thumbnail" && product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt="thumbnail"
                                  style={{ width: 40, height: 40, borderRadius: 4 }}
                                />
                              ) : col.key === "images" && Array.isArray(product.images) ? (
                                product.images.map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={`img-${idx}`}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      marginRight: 4,
                                      borderRadius: 3,
                                    }}
                                  />
                                ))
                              ) : col.key === "tags" && Array.isArray(product.tags) ? (
                                product.tags.join(", ")
                              ) : col.key === "price" || col.key === "discountPrice" ? (
                                product[col.key] !== undefined
                                  ? `$${product[col.key]}`
                                  : "-"
                              ) : col.key === "actions" ? (
                                <>
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      navigate(`/products/edit/${product.id}`)
                                    }
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </>
                              ) : (
                                product[col.key] ?? "-"
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredProducts.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ProductList;
