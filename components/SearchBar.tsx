import { icons } from "@/constants/icons";
import { Image, Text, TextInput, View } from "react-native";

type SearchBarProp ={
    value?:string;
    placeholder:string;
    onPress?:()=>void;
    onChangeText?:(val:string)=>void;
}

const  SearchBar = ({value,placeholder,onPress,onChangeText}:SearchBarProp)=>{
return(
    <View className="flex flex-row items-center bg-dark-200 rounded-full  px-5 py-4">
        <Text>wwe</Text>
            <Image source={icons.search} className="size-5" resizeMode="contain" tintColor="#ab8bff" />
            <TextInput
            onPress={onPress}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
                    className="flex-1 ml-2 text-white"
        placeholderTextColor="#A8B5DB"

            />

           
    
    </View>
)
}

export default SearchBar