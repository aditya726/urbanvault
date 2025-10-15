import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, User, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'buyer', 'seller'

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const roleParam = filter !== 'all' ? `?role=${filter}` : '';
      const { data } = await API.get(`/api/appointments${roleParam}`);
      setAppointments(data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await API.patch(`/api/appointments/${appointmentId}/status`, { status: newStatus });
      toast.success(`Appointment ${newStatus}`);
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await API.delete(`/api/appointments/${appointmentId}`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'buyer' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('buyer')}
          >
            As Buyer
          </Button>
          <Button 
            variant={filter === 'seller' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('seller')}
          >
            As Seller
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No appointments yet</h3>
            <p className="text-muted-foreground">
              {filter === 'seller' 
                ? 'You have no appointment requests for your properties.' 
                : 'Book a property viewing to see your appointments here.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => {
            const isBuyer = appointment.buyer._id === userInfo?._id;
            const isSeller = appointment.seller._id === userInfo?._id;

            return (
              <Card key={appointment._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{appointment.property.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {appointment.property.propertyType} • ${appointment.property.price.toLocaleString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.appointmentTime}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.property.address}</span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {isBuyer ? 'Seller' : 'Buyer'}: {isBuyer ? appointment.seller.username : appointment.buyer.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isBuyer ? appointment.seller.email : appointment.buyerEmail}
                          </p>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="text-sm">
                          <p className="font-medium mb-1">Notes:</p>
                          <p className="text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Actions */}
                  <div className="flex gap-2 justify-end">
                    {isSeller && appointment.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleUpdateStatus(appointment._id, 'confirmed')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleCancelAppointment(appointment._id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </>
                    )}

                    {isSeller && appointment.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                      >
                        Mark as Completed
                      </Button>
                    )}

                    {isBuyer && ['pending', 'confirmed'].includes(appointment.status) && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel Appointment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
