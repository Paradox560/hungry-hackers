import { SignIn } from '@clerk/nextjs'
import { Box, Typography, AppBar, Toolbar, Button } from '@mui/material'

export default function SignInPage() {
    return (
        <div className="min-h-screen full-width bg-themeRed">
            <Box>
                <AppBar 
                    position="static"
                    sx={{
                        width: '100vw',
                        backgroundColor: '#B37238',
                        left: 0,
                        top: 0
                    }}
                >
                    <Toolbar
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            <Button color='inherit' href="/" sx={{textTransform: 'none'}}>
                                <Typography 
                                    variant="h5" 
                                    style={{flexGrow: 1}} 
                                    sx={{
                                        letterSpacing: 1,
                                    }}
                                >
                                    Capital Area Food Chat
                                </Typography>
                            </Button>
                        </Box>
                        <Box>
                            <Button color='inherit' href="/sign-up">Sign Up</Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{textAlign: 'center', my: 4}}
                    className="text-themeCream"
                >
                    <Typography 
                        variant="h1" 
                        gutterBottom
                        sx={{
                            fontSize: '5rem',
                        }}
                    >
                        Sign In
                    </Typography>
                    <SignIn />
                </Box>
            </Box>
        </div>
    )
}