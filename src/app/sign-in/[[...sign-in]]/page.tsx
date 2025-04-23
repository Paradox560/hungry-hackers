import { SignIn } from "@clerk/nextjs";
import { Box, Typography, Container, Paper } from "@mui/material";

export default function SignInPage() {
  return (
    <div className="min-h-screen full-width bg-[#E8F5E9]">
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ textAlign: "center", py: 8 }}
        >
          <Typography
            variant="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
              fontWeight: 700,
              color: "primary.main",
              mb: 4,
            }}
          >
            Sign In
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              width: "100%",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div className="flex justify-center w-full">
              <SignIn />
            </div>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}
