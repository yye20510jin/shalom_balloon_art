export async function getJson(res){
    const data = await res.json().catch(()=>null);
    return data;
}