export function useFormatPhoneNumber(phone){

    return phone.replace(/\D/g,"").replace(/^(\d{3})(\d{0,4})(\d{0,4})$/,(m,p1,p2,p3) =>
        p3 ? `${p1}-${p2}-${p3}` : p2 ? `${p1}-${p2}` : p1
    );

}