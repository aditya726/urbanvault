import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Mail, User, Phone } from 'lucide-react';

export default function ProfilePage() {
    const { user, isAuthLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const { data } = await API.get('/api/users/profile');
                    setProfileData(data);
                } catch (error) {
                    toast.error("Could not fetch your profile data.");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        
        if (!isAuthLoading) {
            fetchProfile();
        }
    }, [user, isAuthLoading]);

    // Show a loading spinner while checking auth or fetching data
    if (isAuthLoading || isLoading) {
        return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    // Redirect to login if the user is not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Show a message if data couldn't be loaded
    if (!profileData) {
        return <div className="text-center py-10">Could not load profile. Please try again later.</div>;
    }

    return (
        <div className="container max-w-2xl mx-auto py-8">
            <Card>
                <CardHeader className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/20">
                        <AvatarImage src={profileData.profilePicture} alt={profileData.username} />
                        <AvatarFallback className="text-3xl">
                            {profileData.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{profileData.username}</CardTitle>
                    <CardDescription>Member since {new Date(profileData.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="mt-4 space-y-4">
                    <div className="flex items-center text-sm">
                        <User className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span className="font-medium">Username:</span>
                        <span className="ml-2 text-muted-foreground">{profileData.username}</span>
                    </div>
                     <div className="flex items-center text-sm">
                        <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span className="ml-2 text-muted-foreground">{profileData.email}</span>
                    </div>
                     <div className="flex items-center text-sm">
                        <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2 text-muted-foreground">{profileData.phoneNumber || "Not provided"}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}