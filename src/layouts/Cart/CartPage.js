import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, updateCartItem, removeFromCart, placeOrder } = useCart();
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleQtyChange = async (itemId, e) => {
    const qty = parseInt(e.target.value, 10);
    if (qty > 0) {
      try {
        await updateCartItem(itemId, qty);
        setSnack({ open: true, message: "Quantity updated!", severity: "success" });
      } catch (err) {
        setSnack({ open: true, message: "Failed to update quantity.", severity: "error" });
      }
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setSnack({ open: true, message: "Item removed from cart.", severity: "success" });
    } catch (err) {
      setSnack({ open: true, message: "Failed to remove item.", severity: "error" });
    }
  };

  const handlePlaceOrder = async () => {
    const res = await placeOrder();
    setSnack({ open: true, message: res.message, severity: res.success ? "success" : "error" });  
   
    // Redirect to /orders after 1.5s ONLY if success
    if (res.success) {
      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Typography variant="h4" gutterBottom sx={{ m: 4 }}>
        Your Cart
      </Typography>

      <Grid container spacing={4} sx={{ px: 4 }}>
        {cartItems.length === 0 && (
          <Typography variant="body1" sx={{ width: "100%", textAlign: "center" }}>
            Your cart is empty.
          </Typography>
        )}

        {cartItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {item.thumbnail && (
                <CardMedia component="img" height="180" image={item.thumbnail} alt={item.name} />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  Price: ${item.price.toFixed(2)}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <TextField
                    label="Qty"
                    type="number"
                    size="small"
                    value={item.quantity}
                    inputProps={{ min: 1, max: item.stock }}
                    onChange={(e) => handleQtyChange(item.id, e)}
                    sx={{ width: 80, mr: 2 }}
                  />
                  <Button variant="outlined" color="error" onClick={() => handleRemove(item.id)} sx={{ color: "#d32f2f" }} >
                    Remove
                  </Button>
                  {/* <Button
                      onClick={() => removeFromCart(product.id)}
                      variant="outlined"
                      color="error"
                      sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: "bold",
                          px: 2,
                          py: 0.5,
                          "&:hover": {
                              backgroundColor: "#ffe6e6",
                              borderColor: "#f44336",
                          },
                      }}
                  >Remove</Button> */}

                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {cartItems.length > 0 && (
        <Box sx={{ px: 4, mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5">Total: ${total.toFixed(2)}</Typography>
                <Button sx={{ backgroundColor: "#1976d2", color: "#fff" }} variant="contained" color="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </Box>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
