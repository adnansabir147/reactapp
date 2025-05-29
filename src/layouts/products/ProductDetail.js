// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../firebase";

// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import MDBox from "components/MDBox";
// import { Card, Typography, Grid, Chip } from "@mui/material";

// function ProductDetailPage() {
//     const { id } = useParams();
//     const [product, setProduct] = useState(null);

//     useEffect(() => {
//         const fetchProduct = async () => {
//             const docRef = doc(db, "Products", id);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 setProduct({ id: docSnap.id, ...docSnap.data() });
//             } else {
//                 console.error("No such product!");
//             }
//         };
//         fetchProduct();
//     }, [id]);

//     if (!product) {
//         return <Typography variant="h6" sx={{ m: 4 }}>Loading product...</Typography>;
//     }

//     return (
//         <DashboardLayout>
//             <DashboardNavbar />
//             <MDBox pt={6} pb={3}>
//                 <Grid container justifyContent="center">
//                     <Grid item xs={12} md={10} lg={8}>
//                         <Card sx={{ p: 4 }}>
//                             <Typography variant="h4" gutterBottom>
//                                 {product.name}
//                             </Typography>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={12} md={6}>
//                                     {product.thumbnail && (
//                                         <img
//                                             src={product.thumbnail}
//                                             alt="Thumbnail"
//                                             style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8 }}
//                                         />
//                                     )}
//                                     {product.images?.length > 0 && (
//                                         <Grid container spacing={1} mt={1}>
//                                             {product.images.map((img, idx) => (
//                                                 <Grid item key={idx}>
//                                                     <img
//                                                         src={img}
//                                                         alt={`img-${idx}`}
//                                                         style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
//                                                     />
//                                                 </Grid>
//                                             ))}
//                                         </Grid>
//                                     )}
//                                 </Grid>
//                                 <Grid item xs={12} md={6}>
//                                     <Typography variant="body1" paragraph>
//                                         <strong>Description:</strong> {product.description || "N/A"}
//                                     </Typography>
//                                     <Typography variant="body1" paragraph>
//                                         <strong>Price:</strong> ${product.price}
//                                     </Typography>
//                                     <Typography variant="body1" paragraph>
//                                         <strong>Discount Price:</strong> ${product.discountPrice || "-"}
//                                     </Typography>
//                                     <Typography variant="body1" paragraph>
//                                         <strong>Stock:</strong> {product.stock}
//                                     </Typography>
//                                     <Typography variant="body1" paragraph>
//                                         <strong>Category:</strong> {product.category || "-"}
//                                     </Typography>
//                                     {product.tags?.length > 0 && (
//                                         <Typography variant="body1" paragraph>
//                                             <strong>Tags:</strong>{" "}
//                                             {product.tags.map((tag, idx) => (
//                                                 <Chip
//                                                     key={idx}
//                                                     label={tag}
//                                                     size="small"
//                                                     sx={{ m: 0.5 }}
//                                                 />
//                                             ))}
//                                         </Typography>
//                                     )}
//                                     {product.createdAt && (
//                                         <Typography variant="body2" color="text.secondary">
//                                             Created: {new Date(product.createdAt.seconds * 1000).toLocaleString()}
//                                         </Typography>
//                                     )}
//                                 </Grid>
//                             </Grid>
//                         </Card>
//                     </Grid>
//                 </Grid>
//             </MDBox>
//         </DashboardLayout>
//     );
// }

// export default ProductDetailPage;

// ------------

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";

import {
  Card,
  Typography,
  Grid,
  Chip,
  Button,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../contexts/AuthContext"; // ✅ Import AuthContext

function ProductDetailPage() {

  // // const { user, authLoading } = useAuth();

  // useEffect(() => {
  //     if (!authLoading) {
  //         console.log("🛒 User inside ProductDetail:", user);
  //     }
  // }, [authLoading, user]);
  
  // useEffect(() => {
  //   console.log("Auth loading:", authLoading);
  //   console.log("Current user:", user);
  // }, [authLoading, user]);
    
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth(); // ✅ Access user
  const navigate = useNavigate(); // ✅ add this line inside the component

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "Products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      alert("You must be logged in to add items to your cart.");
      return;
    }

    const validQty = Math.min(Math.max(1, quantity), product.stock);
    if (validQty > 0) {
      addToCart(product, validQty); // ✅ Fix the argument structure
      setSnackbarOpen(true);

      // ✅ auto redirect after 1.5 sec
      setTimeout(() => {
        navigate("/cart");
      }, 1500);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setQuantity(value);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!product) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Typography variant="h6" sx={{ m: 4 }}>
          Loading product...
        </Typography>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Grid container spacing={3}>
                {/* Product Image */}
                <Grid item xs={12} md={6}>
                  {product.thumbnail && (
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      style={{
                        width: "100%",
                        maxHeight: 300,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  )}

                  {/* Additional Images */}
                  {product.images?.length > 0 && (
                    <Grid container spacing={1} mt={1}>
                      {product.images.map((img, idx) => (
                        <Grid item key={idx}>
                          <img
                            src={img}
                            alt={`img-${idx}`}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>

                {/* Product Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" paragraph>
                    <strong>Description:</strong>{" "}
                    {product.description || "No description available."}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Price:</strong> ${product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Discount Price:</strong>{" "}
                    {product.discountPrice
                      ? `$${product.discountPrice.toFixed(2)}`
                      : "N/A"}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Stock:</strong> {product.stock}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Category:</strong>{" "}
                    {product.category || "Uncategorized"}
                  </Typography>

                  {product.tags?.length > 0 && (
                    <Typography variant="body1" paragraph>
                      <strong>Tags:</strong>{" "}
                      {product.tags.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Typography>
                  )}

                  {product.createdAt?.seconds && (
                    <Typography variant="body2" color="text.secondary" mt={2}>
                      Created:{" "}
                      {new Date(
                        product.createdAt.seconds * 1000
                      ).toLocaleString()}
                    </Typography>
                  )}

                  {/* Quantity & Add to Cart */}
                  <Grid container spacing={2} mt={3}>
                    <Grid item xs={5} sm={4}>
                      <TextField
                        label="Quantity"
                        type="number"
                        size="small"
                        value={quantity}
                        inputProps={{
                          min: 1,
                          max: product.stock,
                        }}
                        onChange={handleQuantityChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={7} sm={8}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddToCart}
                        disabled={product.stock < 1}
                        fullWidth
                        sx={{ backgroundColor: "#1976d2", color: "#fff", height: "100%" }}
                      >
                        {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Product added to cart!
          </Alert>
        </Snackbar>
      </MDBox>
    </DashboardLayout>
  );
}

export default ProductDetailPage;


