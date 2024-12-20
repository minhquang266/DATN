import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PropertyListingSkeleton } from './PropertyListingSkeleton';

export default function PropertyListings({ dataFromServer = [] }) {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const totalPages = Math.ceil(dataFromServer.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataFromServer.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Simulate loading delay when changing pages
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <PropertyListingSkeleton key={index} />
            ))
          : currentItems.map((item) => {
              const firstImageUrl = item.images[0];
              return (
                <Link
                  key={item.id}
                  to={`/detailproduct?nhadat=true&id=${item.id}`}
                  className="block"
                >
                  <Card
                    className={`h-full transition-all hover:shadow-lg ${
                      item.type_posting_id === 4
                        ? 'border-primary shadow-primary/20'
                        : ''
                    }`}
                  >
                    <CardHeader className="relative p-0">
                      <img
                        src={firstImageUrl}
                        alt="Property"
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-t-lg"
                        loading="lazy"
                      />
                      {item.type_posting_id === 4 && (
                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                          VIP
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle
                        className={`text-lg mb-2 ${
                          item.type_posting_id === 4 ? 'text-primary' : ''
                        }`}
                      >
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.land_area} m²</span>
                      </div>
                      <p className="font-semibold mb-2">Giá: {item.cost}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.content}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      {item.type_posting_id === 4 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center space-x-1 text-primary">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tin VIP - Ưu tiên hiển thị</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <div className="flex-grow" />
                      )}
                      <Button variant="ghost" className="ml-auto">
                        Xem chi tiết <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNumber);
                      }}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
