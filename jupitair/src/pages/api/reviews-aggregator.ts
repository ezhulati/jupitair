import type { APIRoute } from 'astro';

export interface ReviewData {
  lastUpdated: string;
  averageRating: number;
  totalReviews: number;
  googleReviews: number;
  facebookReviews: number;
  reviews: any[];
}

// In production, these would be fetched from Facebook Graph API and Google Places API
// For now, we'll use mock data that simulates real counts
const GOOGLE_PLACE_ID = 'ChIJN1t_tDeuEmsRUsoyG83frY4'; // Replace with actual place ID
const FACEBOOK_PAGE_ID = 'jupitairhvac'; // Replace with actual page ID

async function fetchGoogleReviews() {
  // In production:
  // const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${process.env.GOOGLE_API_KEY}`);
  // const data = await response.json();
  // return { count: data.result.user_ratings_total, rating: data.result.rating, reviews: data.result.reviews };
  
  // Mock data for now - simulating real Google reviews
  return {
    count: 47,
    rating: 4.8,
    reviews: [
      {
        author: "John Smith",
        rating: 5,
        text: "Excellent service from Jupitair HVAC! They fixed our AC unit quickly and professionally.",
        date: "2024-08-14",
        source: "google"
      },
      {
        author: "Emily Davis",
        rating: 5,
        text: "Very responsive and fair pricing. Would definitely recommend to anyone in the Frisco area.",
        date: "2024-08-10",
        source: "google"
      }
    ]
  };
}

async function fetchFacebookReviews() {
  // In production:
  // const response = await fetch(`https://graph.facebook.com/v17.0/${FACEBOOK_PAGE_ID}/ratings?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`);
  // const data = await response.json();
  // return { count: data.summary.total_count, rating: data.summary.rating, reviews: data.data };
  
  // Mock data for now - simulating real Facebook reviews
  return {
    count: 28,
    rating: 4.9,
    reviews: [
      {
        author: "Sarah Mitchell",
        rating: 5,
        text: "Jupitair came out same day when our AC broke. Fast, professional, and honest pricing!",
        date: "2024-08-15",
        source: "facebook"
      },
      {
        author: "Mike Johnson",
        rating: 5,
        text: "Great experience with their maintenance program. Highly recommend!",
        date: "2024-08-12",
        source: "facebook"
      }
    ]
  };
}

export const GET: APIRoute = async () => {
  try {
    // Fetch reviews from both platforms
    const [googleData, facebookData] = await Promise.all([
      fetchGoogleReviews(),
      fetchFacebookReviews()
    ]);
    
    // Calculate combined metrics
    const totalReviews = googleData.count + facebookData.count;
    const weightedRating = (
      (googleData.rating * googleData.count + facebookData.rating * facebookData.count) / 
      totalReviews
    ).toFixed(1);
    
    // Combine reviews from both sources
    const allReviews = [...googleData.reviews, ...facebookData.reviews]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20); // Keep most recent 20 reviews
    
    const reviewData: ReviewData = {
      lastUpdated: new Date().toISOString(),
      averageRating: parseFloat(weightedRating),
      totalReviews,
      googleReviews: googleData.count,
      facebookReviews: facebookData.count,
      reviews: allReviews
    };
    
    return new Response(JSON.stringify(reviewData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    
    // Return fallback data if APIs fail
    return new Response(JSON.stringify({
      lastUpdated: new Date().toISOString(),
      averageRating: 4.9,
      totalReviews: 75,
      googleReviews: 47,
      facebookReviews: 28,
      reviews: []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};