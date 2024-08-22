import { fetchVisitor } from '@/utils/api';
import Card from '@/components/Visitor/cardInfo';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { visitor as VisitorType } from '@/types/visitor';
import { GetServerSideProps } from 'next';

type Props = {
    params: {
        id: string;
    };
};

// Server component
const VisitorPage = async ({ params }: Props) => {
    const { id } = params;
    const visitor: VisitorType | null = await fetchVisitor(id);

    return (
        <DefaultLayout>
            <div className="container mx-auto p-4 mt-10">
                {visitor ? (
                    <Card visitor={visitor} />
                ) : (
                    <p className='text-red'>Visitor not found</p>
                )}
            </div>
        </DefaultLayout>
    );
};

export default VisitorPage;