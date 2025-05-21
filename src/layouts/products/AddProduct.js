// AddProduct.js
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

// Material Kit 2 React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

function AddProduct() {
  const [product, setProduct] = useState({ name: "", price: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Products"), {
        name: product.name,
        price: parseFloat(product.price),
        createdAt: serverTimestamp(),
      });
      navigate("/products");
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Card sx={{ maxWidth: 500, mx: "auto", p: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Add New Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                fullWidth
                label="Product Name"
                name="name"
                value={product.name}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                fullWidth
                label="Price"
                name="price"
                value={product.price}
                onChange={handleChange}
                type="number"
              />
            </MDBox>
            <MDBox display="flex" justifyContent="flex-end">
              <MDButton variant="gradient" color="info" type="submit">
                Add Product
              </MDButton>
            </MDBox>
          </form>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AddProduct;