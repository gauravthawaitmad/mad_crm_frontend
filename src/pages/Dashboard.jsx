// import DashboardModule from '@/modules/DashboardModule';
// export default function Dashboard() {
//   console.log("dashboard page loaded")
//   return <DashboardModule />;
// }



import DashboardModule from '@/modules/DashboardModule';
import PageInfoPopup from '@/components/CustomPopUp/PageInfoPopUp';
export default function Dashboard() {
  console.log("dashboard page loaded")
  return(
    <>
    <PageInfoPopup message={''} heading={'Welcome to Dashboard'} />
    <DashboardModule />;
    </>

  ) 
    
}