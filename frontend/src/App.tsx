import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Card, CardContent, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://loremflickr.com/g/1200/400/cryptocurrency?lock=1)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8, 0, 6),
  marginBottom: theme.spacing(4),
}));

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

interface PostFormData {
  title: string;
  body: string;
  author: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { control, handleSubmit, reset } = useForm<PostFormData>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      await backend.createPost(data.title, data.body, data.author);
      reset();
      setShowForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <HeroSection>
        <Typography variant="h2" align="center" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5" align="center" paragraph>
          Explore the latest in cryptocurrency news and insights
        </Typography>
      </HeroSection>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {posts.map((post) => (
            <Card key={post.id.toString()} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                </Typography>
                <Typography variant="body1" paragraph>
                  {post.body}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setShowForm(!showForm)}
              sx={{ marginBottom: 2 }}
            >
              {showForm ? 'Hide Form' : 'Create New Post'}
            </Button>
            {showForm && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="title"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Title is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Title"
                      fullWidth
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
                <Controller
                  name="body"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Body is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Body"
                      fullWidth
                      multiline
                      rows={4}
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
                <Controller
                  name="author"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Author is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Author"
                      fullWidth
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                  Submit Post
                </Button>
              </form>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
