// import DashboardModule from '@/modules/DashboardModule';
// export default function Dashboard() {
//   console.log("dashboard page loaded")
//   return <DashboardModule />;
// }



import DashboardModule from '@/modules/DashboardModule';
import PageInfoPopup from '@/components/CustomPopUp/PageInfoPopup';
export default function Dashboard() {
  return(
    <>
    <PageInfoPopup message={''} heading={'Welcome to Dashboard'} />
    <DashboardModule />;
    </>

  ) 
    
}