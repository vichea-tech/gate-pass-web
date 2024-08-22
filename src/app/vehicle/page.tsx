import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Vehicle from "@/components/Vehicle/index";

const VehiclePage = () =>{
    return (
        <DefaultLayout>
            <p className="text-[30px] text-black-2">Truck</p>
            <Vehicle vehicle={[]} types={[]} />
        </DefaultLayout>
    );
}
export default VehiclePage;