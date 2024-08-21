import Func "mo:base/Func";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Time "mo:base/Time";
import List "mo:base/List";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Order "mo:base/Order";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Int;
  };

  // Stable variable to store posts
  stable var posts : List.List<Post> = List.nil();
  stable var nextId : Nat = 0;

  // Function to create a new post
  public func createPost(title: Text, body: Text, author: Text) : async Nat {
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := List.push(post, posts);
    nextId += 1;
    post.id
  };

  // Function to get all posts, sorted by timestamp (most recent first)
  public query func getPosts() : async [Post] {
    let postsArray = List.toArray(posts);
    let sortedArray = Array.sort(postsArray, func (a: Post, b: Post) : Order.Order {
      Int.compare(b.timestamp, a.timestamp)
    });
    sortedArray
  };
}
